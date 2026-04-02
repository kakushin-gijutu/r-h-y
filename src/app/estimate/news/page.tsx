"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NewsRow, NewsInsert } from "@/lib/database.types";
import { getNews, createNews, updateNews, deleteNews } from "@/lib/news";

const emptyNews: NewsInsert = {
  title: "",
  content: "",
  published: false,
  published_at: null,
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isWithin24h(dateStr: string | null) {
  if (!dateStr) return false;
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 24 * 60 * 60 * 1000;
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NewsInsert & { id?: string }>(emptyNews);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      const data = await getNews();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing.title.trim()) {
      alert("タイトルを入力してください");
      return;
    }
    setSaving(true);
    try {
      if (editing.id) {
        const { id, ...data } = editing;
        await updateNews(id, data);
      } else {
        await createNews(editing);
      }
      setEditing(emptyNews);
      setShowForm(false);
      await load();
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: NewsRow) => {
    setEditing({
      id: item.id,
      title: item.title,
      content: item.content,
      published: item.published,
      published_at: item.published_at,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("削除しますか？")) return;
    await deleteNews(id);
    load();
  };

  const handleCancel = () => {
    setEditing(emptyNews);
    setShowForm(false);
  };

  const handleNew = () => {
    setEditing({ ...emptyNews });
    setShowForm(true);
  };

  const handleTogglePublish = async (item: NewsRow) => {
    const newPublished = !item.published;
    await updateNews(item.id, {
      published: newPublished,
      published_at: newPublished ? new Date().toISOString() : item.published_at,
    });
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">お知らせ管理</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {items.length}件（公開中: {items.filter((n) => n.published).length}）
            </p>
          </div>
          <Button
            size="sm"
            className="bg-gray-800 text-white hover:bg-gray-700"
            onClick={handleNew}
          >
            ＋ 新規お知らせ
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">
                {editing.id ? "お知らせを編集" : "新規お知らせ"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div>
                <Label className="text-xs">タイトル *</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="h-8 text-sm"
                  placeholder="例: GW休業のお知らせ"
                />
              </div>
              <div>
                <Label className="text-xs">内容</Label>
                <textarea
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="お知らせの詳細内容を入力..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={editing.published}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      published: e.target.checked,
                      published_at: e.target.checked
                        ? editing.published_at || new Date().toISOString()
                        : editing.published_at,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="published" className="text-xs cursor-pointer">
                  公開する
                </Label>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  className="bg-gray-800 text-white hover:bg-gray-700"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "保存中..." : editing.id ? "更新" : "登録"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  キャンセル
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <div className="bg-white rounded-lg border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">読み込み中...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              お知らせがありません。上のボタンから追加してください。
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs w-[70px]">状態</TableHead>
                  <TableHead className="text-xs">タイトル</TableHead>
                  <TableHead className="text-xs">内容</TableHead>
                  <TableHead className="text-xs w-[160px]">公開日時</TableHead>
                  <TableHead className="text-xs text-center w-[160px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          item.published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.published ? "公開" : "下書き"}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      <div className="flex items-center gap-2">
                        {item.title}
                        {isWithin24h(item.published_at) && item.published && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500 text-white font-bold">
                            NEW
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-[300px] truncate">
                      {item.content || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(item.published_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleTogglePublish(item)}
                        >
                          {item.published ? "非公開" : "公開"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleEdit(item)}
                        >
                          編集
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
                        >
                          削除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
