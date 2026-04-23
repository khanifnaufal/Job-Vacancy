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
        // SQLite doesn't support proper ENUM modification, so we change it to string for flexibility
        Schema::table('vacancies', function (Blueprint $table) {
            $table->string('job_type')->default('full-time')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->enum('job_type', ['full-time', 'part-time', 'contract', 'remote'])->default('full-time')->change();
        });
    }
};
