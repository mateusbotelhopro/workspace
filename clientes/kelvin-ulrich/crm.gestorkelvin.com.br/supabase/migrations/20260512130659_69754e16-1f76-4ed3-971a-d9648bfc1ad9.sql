
REVOKE EXECUTE ON FUNCTION public.log_client_activity() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_payment_activity() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_task_activity() FROM PUBLIC, anon, authenticated;
