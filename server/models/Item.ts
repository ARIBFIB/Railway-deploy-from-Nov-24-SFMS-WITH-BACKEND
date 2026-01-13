import { supabase } from '../config/database';

export interface Item {
    id?: string;
    foundation_id: string;
    item_number: string;
    ean?: string;
    name: string;
    supplier?: string;
    manufacturer?: string;
    manufacturer_item_number?: string;
    unit?: string;
    notes?: string;
    active: boolean;
    item_package: boolean;
    item_type: 'goods' | 'service' | 'other';
    stock_item: boolean;
    external_webshop: boolean;
    discontinued: boolean;
    bulky: boolean;
    sale_account: string;
    vat: string;
    sales_se_reverse_charge?: string;
    sales_eu_reverse_charge: string;
    sales_eu_subject_to_vat: string;
    sales_export: string;
    purchase_account: string;
    cost_calculation: number;
    stock_value: number;
    in_warehouse: number;
    reserved_quantity: number;
    available_amount: number;
    order_point: number;
    stock_location?: string;
    width_mm?: number;
    height_mm?: number;
    depth_mm?: number;
    weight_grams?: number;
    created_at?: string;
    updated_at?: string;
}

export type CreateItemData = Omit<Item, 'id' | 'created_at' | 'updated_at'>;
export type UpdateItemData = Partial<CreateItemData> & { id: string };

export class ItemModel {
    static async create(foundationId: string, itemData: CreateItemData, userId: string): Promise<Item> {
        console.log('🔍 ItemModel.create - Using Supabase client with key length:', (supabase as any).supabaseKey?.length);
        try {
            const insertData = {
                foundation_id: foundationId,
                item_number: itemData.item_number,
                ean: itemData.ean,
                name: itemData.name,
                supplier: itemData.supplier,
                manufacturer: itemData.manufacturer,
                manufacturer_item_number: itemData.manufacturer_item_number,
                unit: itemData.unit,
                notes: itemData.notes,
                active: itemData.active !== undefined ? itemData.active : true,
                item_package: itemData.item_package !== undefined ? itemData.item_package : false,
                item_type: itemData.item_type || 'goods',
                stock_item: itemData.stock_item !== undefined ? itemData.stock_item : true,
                external_webshop: itemData.external_webshop !== undefined ? itemData.external_webshop : false,
                discontinued: itemData.discontinued !== undefined ? itemData.discontinued : false,
                bulky: itemData.bulky !== undefined ? itemData.bulky : false,
                sale_account: itemData.sale_account || '3001',
                vat: itemData.vat || '25',
                sales_se_reverse_charge: itemData.sales_se_reverse_charge,
                sales_eu_reverse_charge: itemData.sales_eu_reverse_charge || '3108',
                sales_eu_subject_to_vat: itemData.sales_eu_subject_to_vat || '3106',
                sales_export: itemData.sales_export || '3105',
                purchase_account: itemData.purchase_account || '4000',
                cost_calculation: itemData.cost_calculation || 0,
                stock_value: itemData.stock_value || 0,
                in_warehouse: itemData.in_warehouse || 0,
                reserved_quantity: itemData.reserved_quantity || 0,
                available_amount: itemData.available_amount || 0,
                order_point: itemData.order_point || 0,
                stock_location: itemData.stock_location,
                width_mm: itemData.width_mm,
                height_mm: itemData.height_mm,
                depth_mm: itemData.depth_mm,
                weight_grams: itemData.weight_grams
            };

            const { data, error } = await supabase
                .from('items')
                .insert([insertData])
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to create item: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    }

    static async getByFoundation(foundationId: string, filters?: {
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ items: Item[]; total: number }> {
        try {
            let query = supabase
                .from('items')
                .select('*', { count: 'exact' })
                .eq('foundation_id', foundationId)
                .order('created_at', { ascending: false });

            if (filters?.search) {
                query = query.or(`item_number.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
            }

            if (filters?.limit) {
                query = query.limit(filters.limit);
            }

            if (filters?.offset) {
                query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
            }

            const { data, error, count } = await query;

            if (error) {
                throw new Error(`Failed to fetch items: ${error.message}`);
            }

            return {
                items: data || [],
                total: count || 0
            };
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    }

    static async getById(itemId: string): Promise<Item> {
        try {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('id', itemId)
                .single();

            if (error) {
                throw new Error(`Failed to fetch item: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error('Error fetching item:', error);
            throw error;
        }
    }

    static async update(itemId: string, itemData: UpdateItemData, userId: string): Promise<Item> {
        try {
            // Remove unwanted fields added by apiFetch or other sources
            const { id, foundationId, userId: _u, roleId, ...updateFields } = itemData as any;

            const { data, error } = await supabase
                .from('items')
                .update(updateFields)
                .eq('id', itemId)
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to update item: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    }

    static async delete(itemId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('items')
                .delete()
                .eq('id', itemId);

            if (error) {
                throw new Error(`Failed to delete item: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }
}
