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
        Schema::table('applications', function (Blueprint $table) {
            $table->decimal('offered_salary', 15, 2)->nullable();
            $table->text('benefits')->nullable();
            $table->date('start_date')->nullable();
            $table->timestamp('offer_accepted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn(['offered_salary', 'benefits', 'start_date', 'offer_accepted_at']);
        });
    }
};
