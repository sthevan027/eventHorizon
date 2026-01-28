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
        Schema::create('mercado_pago_payments', static function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->string('payment_id'); // ID do pagamento/preferência no Mercado Pago
            $table->string('payment_type')->default('pix'); // 'pix' ou 'checkout_pro'
            $table->string('status')->nullable(); // pending, approved, rejected, cancelled, refunded
            $table->string('qr_code')->nullable(); // Para PIX
            $table->text('qr_code_base64')->nullable(); // Para PIX
            $table->string('ticket_url')->nullable(); // Para PIX
            $table->string('init_point')->nullable(); // Para Checkout Pro
            $table->bigInteger('amount_received')->nullable();
            $table->string('currency', 10)->default('BRL');
            $table->json('metadata')->nullable();
            $table->json('last_error')->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
            $table->softDeletes();

            $table->index('payment_id');
            $table->index('order_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mercado_pago_payments');
    }
};
