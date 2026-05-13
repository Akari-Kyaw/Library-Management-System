<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favourites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('userId');
            $table->unsignedBigInteger('bookId');
            $table->timestamps();

            $table->unique(['userId', 'bookId']);
            $table->foreign('userId')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('bookId')->references('id')->on('books')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favourites');
    }
};
