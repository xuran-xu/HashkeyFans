-- AlterTable
ALTER TABLE "users" ALTER COLUMN "display_address" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE INDEX "cards_id_title_idx" ON "cards"("id", "title");

-- CreateIndex
CREATE INDEX "user_cards_user_id_card_id_idx" ON "user_cards"("user_id", "card_id");

-- CreateIndex
CREATE INDEX "user_cards_card_id_idx" ON "user_cards"("card_id");

-- CreateIndex
CREATE INDEX "users_wallet_address_idx" ON "users"("wallet_address");
