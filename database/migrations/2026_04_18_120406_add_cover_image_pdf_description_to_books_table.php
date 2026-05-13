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
        Schema::table('books', function (Blueprint $table) {
            $table->string('cover_image')->nullable()->after('author');
            $table->string('pdf_file')->nullable()->after('cover_image');
            $table->text('description')->nullable()->after('pdf_file');
        });
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn(['cover_image', 'pdf_file', 'description']);
        });
    }
};
