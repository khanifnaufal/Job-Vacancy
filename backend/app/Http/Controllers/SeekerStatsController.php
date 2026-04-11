<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;

class SeekerStatsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $totalApplications = Application::where('user_id', $user->id)->count();
        
        $activeApplications = Application::where('user_id', $user->id)
            ->whereHas('vacancy', function($query) {
                $query->where(function($q) {
                    $q->where('deadline', '>=', now()->toDateString())
                      ->orWhereNull('deadline');
                });
            })
            ->whereNotIn('status', ['rejected'])
            ->count();

        $interviews = Application::where('user_id', $user->id)
            ->where('status', 'interview')
            ->count();
            
        $recentStatus = Application::where('user_id', $user->id)
            ->with(['vacancy.company'])
            ->orderBy('updated_at', 'desc')
            ->limit(3)
            ->get();

        return response()->json([
            'total_applications' => $totalApplications,
            'active_applications' => $activeApplications,
            'interviews_scheduled' => $interviews,
            'recent_activity' => $recentStatus
        ]);
    }
}
