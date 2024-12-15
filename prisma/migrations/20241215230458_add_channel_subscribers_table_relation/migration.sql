-- AddForeignKey
ALTER TABLE "channel_subscribers" ADD CONSTRAINT "channel_subscribers_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_subscribers" ADD CONSTRAINT "channel_subscribers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
