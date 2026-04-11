<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use App\Models\Application;
use Illuminate\Http\Request;

class RecruiterStatsController extends Controller
{
    public function index(Request $request)
    {
        $company = $request->user()->company;
        
        if (!$company) {
            return response()->json([
                'total_vacancies' => 0,
                'total_applications' => 0,
                'pending_applications' => 0
            ], 200);
        }

        $totalVacancies = Vacancy::where('company_id', $company->id)->count();
        $applicationsQuery = Application::whereHas('vacancy', function($query) use ($company) {
            $query->where('company_id', $company->id);
        });

        return response()->json([
            'total_vacancies' => $totalVacancies,
            'total_applications' => (clone $applicationsQuery)->count(),
            'pending_applications' => (clone $applicationsQuery)->where('status', 'pending')->count(),
            'reviewed_applications' => (clone $applicationsQuery)->where('status', '!=', 'pending')->count(),
        ]);
    }
}
