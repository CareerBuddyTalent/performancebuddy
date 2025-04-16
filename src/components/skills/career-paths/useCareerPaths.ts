
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { CareerPath, CareerRole } from "@/types/career";

export function useCareerPaths() {
  const { user } = useAuth();
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  // Fetch career paths from Supabase
  useEffect(() => {
    const fetchCareerPaths = async () => {
      setIsLoading(true);
      try {
        // Fetch career paths
        const { data: pathsData, error: pathsError } = await supabase
          .from('career_paths')
          .select('*');

        if (pathsError) throw pathsError;

        // Fetch roles for each path
        const pathsWithRoles = await Promise.all(
          pathsData.map(async (path) => {
            const { data: rolesData, error: rolesError } = await supabase
              .from('career_roles')
              .select('*')
              .eq('path_id', path.id)
              .order('order_position', { ascending: true });

            if (rolesError) throw rolesError;

            return {
              ...path,
              roles: rolesData || []
            };
          })
        );

        setPaths(pathsWithRoles);
      } catch (error) {
        console.error('Error fetching career paths:', error);
        toast.error('Failed to load career paths');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareerPaths();
  }, []);

  const handleAddPath = async (newPath: { title: string; color: string }) => {
    if (!newPath.title) {
      toast.error("Please enter a track title");
      return;
    }

    setIsSubmitting(true);
    try {
      // Insert new career path
      const { data, error } = await supabase
        .from('career_paths')
        .insert({
          title: newPath.title,
          color: newPath.color,
          created_by: user?.id
        })
        .select();

      if (error) throw error;

      // Add the new path to state
      setPaths([...paths, { ...data[0], roles: [] }]);
      toast.success("Career path added successfully");
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding career path:', error);
      toast.error('Failed to add career path');
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRole = async (newRole: { title: string; years_experience: string }) => {
    if (!newRole.title || !newRole.years_experience) {
      toast.error("Please fill in all fields");
      return Promise.reject(new Error("Missing required fields"));
    }

    if (!selectedPathId) return Promise.reject(new Error("No path selected"));

    setIsSubmitting(true);
    try {
      // Get the current highest order position
      const { data: existingRoles } = await supabase
        .from('career_roles')
        .select('order_position')
        .eq('path_id', selectedPathId)
        .order('order_position', { ascending: false })
        .limit(1);

      const nextPosition = existingRoles && existingRoles.length > 0 
        ? (existingRoles[0].order_position || 0) + 1 
        : 0;

      // Insert new role
      const { data, error } = await supabase
        .from('career_roles')
        .insert({
          path_id: selectedPathId,
          title: newRole.title,
          years_experience: newRole.years_experience,
          order_position: nextPosition
        })
        .select();

      if (error) throw error;

      // Update the state
      setPaths(paths.map(path => 
        path.id === selectedPathId 
          ? { ...path, roles: [...path.roles, data[0]] } 
          : path
      ));
      
      toast.success("Role added successfully");
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error('Failed to add role');
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePath = async (id: string) => {
    try {
      const { error } = await supabase
        .from('career_paths')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPaths(paths.filter(path => path.id !== id));
      toast.success("Career path removed");
    } catch (error) {
      console.error('Error removing career path:', error);
      toast.error('Failed to remove career path');
    }
  };

  return {
    paths,
    isLoading,
    isSubmitting,
    selectedPathId,
    setSelectedPathId,
    handleAddPath,
    handleAddRole,
    handleRemovePath
  };
}
