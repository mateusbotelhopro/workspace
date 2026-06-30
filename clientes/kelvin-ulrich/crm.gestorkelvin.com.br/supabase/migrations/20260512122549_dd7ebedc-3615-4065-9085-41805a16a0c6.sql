
REVOKE EXECUTE ON FUNCTION public.generate_monthly_payments(DATE) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_monthly_payments(DATE) TO authenticated;
