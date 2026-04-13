<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->string('linkedin_url')->nullable()->after('resume_path');
            $table->string('github_url')->nullable()->after('linkedin_url');
            $table->string('portfolio_url')->nullable()->after('github_url');
            $table->string('avatar_path')->nullable()->after('portfolio_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            //
        });
    }
};
