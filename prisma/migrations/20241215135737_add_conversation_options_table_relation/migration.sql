-- AddForeignKey
ALTER TABLE "conversation_options" ADD CONSTRAINT "conversation_options_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
