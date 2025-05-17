
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ExerciseLibrary from "../components/exercises/ExerciseLibrary";
import { fetchExercises } from "@/services/api";
import { useApi } from "@/hooks/useApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ExercisesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: exercises, isLoading, error } = useApi(fetchExercises, []);

  return (
    <Layout>
      <div className="pt-16 pb-8 bg-gradient-to-br from-purple-500 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <Dumbbell className="h-6 w-6 mr-3" />
            <h1 className="text-3xl font-bold">Exercise Library</h1>
          </div>
          <p className="text-base max-w-2xl mb-6">
            Browse our comprehensive collection of exercises with detailed instructions and animations.
          </p>
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-300" />
              <Input
                className="pl-10 pr-4 py-2 bg-white/10 border-white/20 placeholder:text-white/70 text-white"
                placeholder="Search for exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-8 container mx-auto px-4">
        <ExerciseLibrary searchTerm={searchTerm} />
      </div>
    </Layout>
  );
};

export default ExercisesPage;
