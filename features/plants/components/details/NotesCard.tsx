"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Pencil, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { addNote, deleteNote, getNotes, updateNote } from "../../api";
import type { Note } from "../../types";

import { formatEnDate } from "../../utils/format";

type NotesCardProps = {
  userId: string;
  plantId: string;
};

export function NotesCard({ userId, plantId }: NotesCardProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (!userId || !plantId) return;

    async function fetchNotes() {
      try {
        const data = await getNotes(userId, plantId);
        setNotes(data);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [userId, plantId]);

  async function handleAddNote(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!userId || !plantId) return;
    if (!text.trim()) return;

    setAdding(true);

    try {
      const newNote = await addNote(userId, plantId, { text });

      setNotes((prev) => [newNote, ...prev]);
      setText("");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setEditText(note.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  async function handleUpdate(noteId: string) {
    if (!editText.trim()) return;

    await updateNote(userId, plantId, noteId, editText);

    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, text: editText } : n)),
    );

    cancelEdit();
  }

  async function handleDelete(noteId: string) {
    const confirmed = window.confirm("Delete this note?");
    if (!confirmed) return;
    await deleteNote(userId, plantId, noteId);

    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-sm border-green-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
          <ClipboardList className="w-5 h-5 text-teal-600" />
        </div>

        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-semibold text-green-900">Care Notes</h2>

          {/* ➕ Add Note */}
          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 rounded-lg border border-green-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              Add
            </button>
          </form>

          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              No notes yet. Add your first care note 🌱
            </p>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start justify-between gap-2 bg-white/70 border border-green-50 rounded-lg px-3 py-2"
                >
                  {editingId === note.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 text-sm border rounded px-2 py-1"
                      />
                      <button
                        onClick={() => handleUpdate(note.id)}
                        className="text-xs text-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs text-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-gray-700 flex-1">
                        <span className="text-gray-400 text-xs mr-2">
                          {formatEnDate(note.createdAt)}
                        </span>
                        {note.text}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-6 shrink-0">
                        <Pencil
                          className="text-sm text-blue-500 hover:text-blue-700"
                          onClick={() => startEdit(note)}
                        ></Pencil>

                        <Trash2
                          className="text-sm text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(note.id)}
                        ></Trash2>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
