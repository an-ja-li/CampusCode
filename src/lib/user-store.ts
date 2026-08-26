// ============================================================
// CampusCode — User-Scoped Client Data Store
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import type { User, Project, Product, Proposal, Contract, Notification, StudentProfile } from "@/types";
import { useAuth } from "@/hooks/useAuth";

const STORAGE_KEYS = {
  PROJECTS: "campuscode_user_projects_",
  PRODUCTS: "campuscode_user_products_",
  PROPOSALS: "campuscode_user_proposals_",
  CONTRACTS: "campuscode_user_contracts_",
  NOTIFICATIONS: "campuscode_user_notifications_",
};

export function useUserData() {
  const { user } = useAuth();
  const userId = user?.id || "guest";

  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user data on mount / user change
  useEffect(() => {
    if (!userId || userId === "guest") {
      setProjects([]);
      setProducts([]);
      setProposals([]);
      setContracts([]);
      setNotifications([]);
      setIsLoaded(true);
      return;
    }

    try {
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS + userId);
      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS + userId);
      const savedProposals = localStorage.getItem(STORAGE_KEYS.PROPOSALS + userId);
      const savedContracts = localStorage.getItem(STORAGE_KEYS.CONTRACTS + userId);
      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS + userId);

      setProjects(savedProjects ? JSON.parse(savedProjects) : []);
      setProducts(savedProducts ? JSON.parse(savedProducts) : []);
      setProposals(savedProposals ? JSON.parse(savedProposals) : []);
      setContracts(savedContracts ? JSON.parse(savedContracts) : []);
      setNotifications(savedNotifs ? JSON.parse(savedNotifs) : []);
    } catch {
      // Fallback
    } finally {
      setIsLoaded(true);
    }
  }, [userId]);

  // Project operations
  const addProject = useCallback((newProjectData: Partial<Project>) => {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: newProjectData.name || "Untitled Project",
      description: newProjectData.description || "",
      category: newProjectData.category || "General",
      status: "active",
      progress: 0,
      ownerId: userId,
      technologies: newProjectData.technologies || [],
      isPublished: false,
      members: [{ id: `pm_${Date.now()}`, userId, projectId: `proj_${Date.now()}`, role: "owner", joinedAt: new Date().toISOString() }],
      tasks: [],
      milestones: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newProjectData,
    };

    setProjects((prev) => {
      const updated = [newProject, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PROJECTS + userId, JSON.stringify(updated));
      }
      return updated;
    });

    return newProject;
  }, [userId]);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PROJECTS + userId, JSON.stringify(updated));
      }
      return updated;
    });
  }, [userId]);

  // Product operations
  const addProduct = useCallback((newProductData: Partial<Product>) => {
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: newProductData.name || "Untitled Product",
      description: newProductData.description || "",
      longDescription: newProductData.longDescription || newProductData.description || "",
      category: newProductData.category || "templates",
      price: newProductData.price || 0,
      isFree: Boolean(newProductData.isFree),
      status: "published",
      sellerId: userId,
      technologies: newProductData.technologies || [],
      tags: newProductData.tags || [],
      screenshots: [],
      features: newProductData.features || [],
      requirements: newProductData.requirements || [],
      installationGuide: "",
      documentation: "",
      version: "1.0.0",
      changelog: [],
      reviews: [],
      rating: 5.0,
      reviewCount: 0,
      salesCount: 0,
      license: "Commercial",
      includes: [],
      qualityScore: {
        overall: 95,
        codeQuality: 95,
        documentation: 90,
        demoAvailability: 95,
        readme: 95,
        testing: 90,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newProductData,
    };

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS + userId, JSON.stringify(updated));
      }
      return updated;
    });

    return newProduct;
  }, [userId]);

  // Proposal operations
  const addProposal = useCallback((newProposalData: Partial<Proposal>) => {
    const newProposal: Proposal = {
      id: `prop_${Date.now()}`,
      solutionRequestId: newProposalData.solutionRequestId || "",
      studentId: userId,
      content: newProposalData.content || "",
      price: newProposalData.price || 0,
      estimatedDelivery: newProposalData.estimatedDelivery || 14,
      technologies: newProposalData.technologies || [],
      milestones: newProposalData.milestones || [],
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newProposalData,
    };

    setProposals((prev) => {
      const updated = [newProposal, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PROPOSALS + userId, JSON.stringify(updated));
      }
      return updated;
    });

    return newProposal;
  }, [userId]);

  // Derived user statistics
  const stats = {
    activeProjectsCount: projects.filter((p) => p.status === "active").length,
    publishedProductsCount: products.filter((p) => p.status === "published").length,
    proposalsCount: proposals.length,
    activeContractsCount: contracts.filter((c) => c.status === "active").length,
    totalSales: user?.studentProfile?.totalSales || products.reduce((sum, p) => sum + (p.salesCount || 0), 0),
    totalEarnings: user?.studentProfile?.totalEarnings || products.reduce((sum, p) => sum + ((p.salesCount || 0) * (p.price || 0)), 0),
  };

  return {
    isLoaded,
    projects,
    products,
    proposals,
    contracts,
    notifications,
    stats,
    addProject,
    deleteProject,
    addProduct,
    addProposal,
  };
}
