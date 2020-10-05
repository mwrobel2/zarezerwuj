export interface Krs {
  total?: number;
  items?: [
    {
      address?: {
        city?: string;
        code?: string;
        country?: string;
        house_no?: string;
        post_office?: string;
        street?: string
      };
      business_insert_date?: string;
      ceo?: {
        first_name?: string;
        krs_person_id?: number;
        last_name?: string;
        name?: string;
      };
      current_relations_count?: number;
      first_entry_date?: string;
      historical_relations_count?: number;
      id?: number;
      is_opp?: boolean;
      is_removed?: boolean;
      krs?: string;
      last_entry_date?: string;
      last_entry_no?: number;
      last_state_entry_date?: string;
      last_state_entry_no?: number;
      legal_form?: string;
      name?: string;
      name_short?: string;
      nip?: string;
      regon?: string;
      type?: string;
    }
  ];
}
