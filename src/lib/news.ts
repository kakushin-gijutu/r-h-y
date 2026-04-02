import { getSupabase } from "./supabase";
import type { NewsRow, NewsInsert, NewsUpdate } from "./database.types";

export async function getNews() {
  const { data, error } = await getSupabase()
    .from("news")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return data as NewsRow[];
}

export async function getPublishedNews() {
  const { data, error } = await getSupabase()
    .from("news")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data as NewsRow[];
}

export async function createNews(news: NewsInsert) {
  const { data, error } = await getSupabase()
    .from("news")
    .insert(news)
    .select()
    .single();

  if (error) throw error;
  return data as NewsRow;
}

export async function updateNews(id: string, news: NewsUpdate) {
  const { data, error } = await getSupabase()
    .from("news")
    .update(news)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as NewsRow;
}

export async function deleteNews(id: string) {
  const { error } = await getSupabase().from("news").delete().eq("id", id);
  if (error) throw error;
}
