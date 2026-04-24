<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VacancyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecruiterStatsController;
use App\Http\Controllers\SeekerStatsController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\InterviewSlotController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load(['company', 'profile']);
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::delete('/delete-account', [AuthController::class, 'deleteAccount']);

    // Shared Profile routes
    Route::get('/profile', [UserProfileController::class, 'show']);
    Route::post('/profile', [UserProfileController::class, 'update']);

    // Recruiter-only routes
    Route::middleware('role:recruiter')->group(function () {
        Route::get('/recruiter/stats', [RecruiterStatsController::class, 'index']);
        Route::get('/recruiter/vacancies', [VacancyController::class, 'recruiterVacancies']);
        Route::post('/vacancies', [VacancyController::class, 'store']);
        Route::put('/vacancies/{vacancy}', [VacancyController::class, 'update']);
        Route::delete('/vacancies/{vacancy}', [VacancyController::class, 'destroy']);
        
        Route::get('/recruiter/applications', [ApplicationController::class, 'recruiterIndex']);
        Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);

        Route::get('/company/my', [CompanyController::class, 'myCompany']);
        Route::put('/company/my', [CompanyController::class, 'update']);

        // Interview Slots (Recruiter)
        Route::post('/vacancies/{vacancy}/slots', [InterviewSlotController::class, 'store']);
        Route::delete('/slots/{slot}', [InterviewSlotController::class, 'destroy']);
    });

    // Seeker-only routes
    Route::middleware('role:seeker')->group(function () {
        Route::get('/seeker/stats', [SeekerStatsController::class, 'index']);
        Route::get('/seeker/applications', [ApplicationController::class, 'seekerIndex']);
        Route::post('/applications', [ApplicationController::class, 'store']);

        // Professional History
        Route::post('/profile/experience', [\App\Http\Controllers\ProfessionalHistoryController::class, 'storeExperience']);
        Route::put('/profile/experience/{experience}', [\App\Http\Controllers\ProfessionalHistoryController::class, 'updateExperience']);
        Route::delete('/profile/experience/{experience}', [\App\Http\Controllers\ProfessionalHistoryController::class, 'destroyExperience']);

        Route::post('/profile/education', [\App\Http\Controllers\ProfessionalHistoryController::class, 'storeEducation']);
        Route::put('/profile/education/{education}', [\App\Http\Controllers\ProfessionalHistoryController::class, 'updateEducation']);
        Route::delete('/profile/education/{education}', [\App\Http\Controllers\ProfessionalHistoryController::class, 'destroyEducation']);

        Route::post('/profile/certificate', [\App\Http\Controllers\ProfessionalHistoryController::class, 'storeCertificate']);
        Route::put('/profile/certificate/{certificate}', [\App\Http\Controllers\ProfessionalHistoryController::class, 'updateCertificate']);
        Route::delete('/profile/certificate/{certificate}', [\App\Http\Controllers\ProfessionalHistoryController::class, 'destroyCertificate']);

        // Bookmarks
        Route::get('/bookmarks', [BookmarkController::class, 'index']);
        Route::post('/bookmarks/toggle', [BookmarkController::class, 'toggle']);

        // Interview Slots (Seeker)
        Route::post('/slots/{slot}/book', [InterviewSlotController::class, 'book']);
    });

    // Interview Slots (Shared/Auth only)
    Route::get('/vacancies/{vacancy}/slots', [InterviewSlotController::class, 'index']);
});

// Public company routes
Route::get('/companies/{id}', [CompanyController::class, 'show']);

// Public vacancy routes
Route::get('/vacancies', [VacancyController::class, 'index']);
Route::get('/vacancies/{vacancy}', [VacancyController::class, 'show']);
