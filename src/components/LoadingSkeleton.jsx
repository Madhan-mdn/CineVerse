import React from 'react';

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col bg-surface rounded-xl border border-surface-border overflow-hidden animate-pulse">
      {/* 2:3 aspect poster placeholder */}
      <div className="aspect-[2/3] w-full bg-slate-800" />
      {/* Content lines */}
      <div className="p-3.5 space-y-2.5">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="flex items-center justify-between">
          <div className="h-3 bg-slate-800/80 rounded w-1/3" />
          <div className="h-3 bg-slate-800/80 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function MovieDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="aspect-[2/3] w-full bg-slate-800 rounded-xl" />
        </div>
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          <div className="h-8 bg-slate-800 rounded w-2/3" />
          <div className="h-4 bg-slate-800/80 rounded w-1/3" />
          <div className="h-28 bg-slate-800/60 rounded w-full" />
          <div className="h-10 bg-slate-800 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

// Aliases for seamless imports across components
export const LoadingSkeletonGrid = MovieGridSkeleton;
export const LoadingSkeletonDetails = MovieDetailsSkeleton;
export const LoadingSkeletonCard = MovieCardSkeleton;

export default MovieGridSkeleton;
