-- DropIndex
DROP INDEX "channel_options_channel_id_key";

-- DropIndex
DROP INDEX "conversation_options_conversation_id_key";

-- DropIndex
DROP INDEX "group_options_group_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "channel_options_channel_id_user_id_key" ON "channel_options"("channel_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_options_group_id_user_id_key" ON "group_options"("group_id", "user_id");
