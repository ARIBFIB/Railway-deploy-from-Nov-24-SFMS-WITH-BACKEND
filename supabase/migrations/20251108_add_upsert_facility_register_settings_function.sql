-- Adds a dedicated RPC helper to upsert facility register settings while respecting RLS.
create or replace function public.upsert_facility_register_settings(
  p_foundation_id uuid,
  p_proposed_depreciation_start_date text,
  p_create_asset_from_supplier_invoice boolean,
  p_enable_component_depreciation_support boolean,
  p_user_id uuid
)
returns setof public.facility_register_settings
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_foundation_id is null then
    raise exception 'foundation_id is required';
  end if;

  if p_user_id is null then
    raise exception 'user_id is required';
  end if;

  if not exists (
    select 1
    from public.foundation_members fm
    where fm.foundation_id = p_foundation_id
      and fm.user_id = p_user_id
  ) then
    raise exception 'User % is not authorized for foundation %', p_user_id, p_foundation_id
      using errcode = '42501';
  end if;

  return query
  insert into public.facility_register_settings (
    foundation_id,
    proposed_depreciation_start_date,
    create_asset_from_supplier_invoice,
    enable_component_depreciation_support,
    created_by,
    updated_by
  )
  values (
    p_foundation_id,
    coalesce(p_proposed_depreciation_start_date, 'Acquisition month'),
    coalesce(p_create_asset_from_supplier_invoice, false),
    coalesce(p_enable_component_depreciation_support, false),
    p_user_id,
    p_user_id
  )
  on conflict (foundation_id) do update
    set proposed_depreciation_start_date = excluded.proposed_depreciation_start_date,
        create_asset_from_supplier_invoice = excluded.create_asset_from_supplier_invoice,
        enable_component_depreciation_support = excluded.enable_component_depreciation_support,
        updated_at = timezone('utc', now()),
        updated_by = p_user_id
  returning *;
end;
$$;

revoke all on function public.upsert_facility_register_settings(uuid, text, boolean, boolean, uuid) from public;
grant execute on function public.upsert_facility_register_settings(uuid, text, boolean, boolean, uuid) to authenticated;
grant execute on function public.upsert_facility_register_settings(uuid, text, boolean, boolean, uuid) to service_role;


















