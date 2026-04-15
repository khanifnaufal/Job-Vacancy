<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Vacancy;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    /**
     * Get all vacancies bookmarked by the current user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $bookmarks = Vacancy::whereHas('bookmarks', function($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with('company')
        ->orderBy('created_at', 'desc')
        ->get();

        // Mark them as bookmarked for the frontend
        $bookmarks->each(function ($vacancy) {
            $vacancy->is_bookmarked = true;
        });

        return response()->json($bookmarks);
    }

    /**
     * Toggle bookmark for a vacancy.
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'vacancy_id' => 'required|exists:vacancies,id',
        ]);

        $user = $request->user();
        $vacancyId = $request->vacancy_id;

        $bookmark = Bookmark::where('user_id', $user->id)
            ->where('vacancy_id', $vacancyId)
            ->first();

        if ($bookmark) {
            $bookmark->delete();
            return response()->json([
                'message' => 'Job removed from bookmarks',
                'is_bookmarked' => false
            ]);
        }

        Bookmark::create([
            'user_id' => $user->id,
            'vacancy_id' => $vacancyId,
        ]);

        return response()->json([
            'message' => 'Job added to bookmarks',
            'is_bookmarked' => true
        ], 201);
    }
}
