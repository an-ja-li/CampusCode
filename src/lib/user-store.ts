// ============================================================
// CampusCode — User-Scoped Data Store (Database-Backed)
// ============================================================
// Fetches user's projects, products, proposals, and contracts
// from the database via API routes instead of localStorage.
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import type { Project, Product, Proposal, Contract, Notification } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export function useUserData() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || null;

  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch all user data from API when authenticated
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setProjects([]);
      setProducts([]);
      setProposals([]);
      setContracts([]);
      setNotifications([]);
      setIsLoaded(true);
      return;
    }

    let cancelled = false;

    async function fetchUserData() {
      try {
        const [projectsRes, productsRes, proposalsRes, contractsRes] = await Promise.all([
          fetch(`/api/projects?userId=${userId}`).then((r) => (r.ok ? r.json() : { projects: [] })),
          fetch(`/api/products?sellerId=${userId}`).then((r) => (r.ok ? r.json() : { products: [] })),
          fetch(`/api/proposals?userId=${userId}`).then((r) => (r.ok ? r.json() : { proposals: [] })),
          fetch(`/api/contracts?userId=${userId}`).then((r) => (r.ok ? r.json() : { contracts: [] })),
        ]);

        if (!cancelled) {
          setProjects(projectsRes.projects || []);
          setProducts(productsRes.products || []);
          setProposals(proposalsRes.proposals || []);
          setContracts(contractsRes.contracts || []);
        }
      } catch (error) {
        console.error("[useUserData] Failed to fetch user data:", error);
      } finally {
        if (!cancelled) {
          setIsLoaded(true);
        }
      }
    }

    fetchUserData();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, userId]);

  // Project operations
  const addProject = useCallback(
    async (newProjectData: Partial<Project>) => {
      if (!userId) return null;

      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newProjectData.name || "Untitled Project",
            description: newProjectData.description || "",
            category: newProjectData.category || "general",
            technologies: newProjectData.technologies || [],
            ownerId: userId,
          }),
        });

        if (!res.ok) {
          console.error("[useUserData] Failed to create project");
          return null;
        }

        const newProject = await res.json();
        setProjects((prev) => [newProject, ...prev]);
        return newProject;
      } catch (error) {
        console.error("[useUserData] Error creating project:", error);
        return null;
      }
    },
    [userId]
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setProjects((prev) => prev.filter((p) => p.id !== projectId));
        }
      } catch (error) {
        console.error("[useUserData] Error deleting project:", error);
      }
    },
    []
  );

  // Product operations
  const addProduct = useCallback(
    async (newProductData: Partial<Product>) => {
      if (!userId) return null;

      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newProductData,
            sellerId: userId,
          }),
        });

        if (!res.ok) {
          console.error("[useUserData] Failed to create product");
          return null;
        }

        const newProduct = await res.json();
        setProducts((prev) => [newProduct, ...prev]);
        return newProduct;
      } catch (error) {
        console.error("[useUserData] Error creating product:", error);
        return null;
      }
    },
    [userId]
  );

  // Proposal operations
  const addProposal = useCallback(
    async (newProposalData: Partial<Proposal>) => {
      if (!userId) return null;

      try {
        const res = await fetch("/api/proposals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newProposalData,
            studentId: userId,
          }),
        });

        if (!res.ok) {
          console.error("[useUserData] Failed to create proposal");
          return null;
        }

        const newProposal = await res.json();
        setProposals((prev) => [newProposal, ...prev]);
        return newProposal;
      } catch (error) {
        console.error("[useUserData] Error creating proposal:", error);
        return null;
      }
    },
    [userId]
  );

  // Derived user statistics
  const stats = {
    activeProjectsCount: projects.filter((p) => {
      const s = typeof p.status === 'string' ? p.status.toLowerCase() : '';
      return s === 'active' || s === 'planning' || s === 'in_progress' || !s;
    }).length,
    publishedProductsCount: products.filter((p) => {
      const s = typeof p.status === 'string' ? p.status.toLowerCase() : '';
      return s === 'published' || s === 'pending_review' || s === 'active' || !s;
    }).length,
    proposalsCount: proposals.length,
    activeContractsCount: contracts.filter((c) => {
      const s = typeof c.status === 'string' ? c.status.toLowerCase() : '';
      return s === 'active' || s === 'created';
    }).length,
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
