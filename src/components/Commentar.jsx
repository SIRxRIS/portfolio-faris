import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  getDocs,
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase-comment";
import {
  MessageCircle,
  UserCircle2,
  Loader2,
  AlertCircle,
  Send,
  Pin,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Comment = memo(({ comment, formatDate, index }) => (
  <div
    className={`px-4 pt-4 pb-2 rounded-xl border transition-all group hover:shadow-lg hover:-translate-y-0.5 ${
      comment.isPinned
        ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400/50"
        : "bg-white/5 border-white/10 hover:bg-white/10"
    }`}
  >
    {comment.isPinned && (
      <div className="flex items-center gap-2 mb-2 px-2 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-medium w-fit">
        <Pin className="w-3 h-3" />
        <span>PINNED COMMENT</span>
      </div>
    )}

    <div className="flex items-start gap-3">
      <div
        className={`p-2 rounded-full text-indigo-400 group-hover:bg-indigo-500/30 transition-colors ${
          comment.isPinned ? "bg-indigo-500/40" : "bg-indigo-500/20"
        }`}
      >
        <UserCircle2 className="w-5 h-5" />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white truncate">
              {comment.userName}
            </h4>
            {comment.isAdmin && (
              <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
                Admin
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">
          {comment.content}
        </p>
      </div>
    </div>
  </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const textareaRef = useRef(null);

  const handleTextareaChange = useCallback((e) => {
    setNewComment(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!newComment.trim() || !userName.trim()) return;

      onSubmit({ newComment, userName });
      setNewComment("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    },
    [newComment, userName, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
        <label className="block text-sm font-medium text-white">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          required
        />
      </div>

      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
        <label className="block text-sm font-medium text-white">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleTextareaChange}
          placeholder="Write your message here..."
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[120px]"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        data-aos="fade-up"
        data-aos-duration="1000"
        className="relative w-full h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
        <div className="relative flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Post Comment</span>
            </>
          )}
        </div>
      </button>
    </form>
  );
});

const Komentar = () => {
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      once: false,
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    const commentsRef = collection(db, "portfolio-comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    return onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort comments: pinned first, then by creation date
      const sortedComments = commentsData.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt?.toDate() - a.createdAt?.toDate();
      });

      setComments(sortedComments);
    });
  }, []);

  const handleCommentSubmit = useCallback(async ({ newComment, userName }) => {
    setError("");
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "portfolio-comments"), {
        content: newComment,
        userName,
        isAdmin: false,
        isPinned: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      setError("Failed to post comment. Please try again.");
      console.error("Error adding comment: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleTogglePin = useCallback(async (commentId, isPinned) => {
    try {
      const commentRef = doc(db, "portfolio-comments", commentId);
      await updateDoc(commentRef, {
        isPinned: isPinned,
      });
    } catch (error) {
      console.error("Error updating pin status: ", error);
      setError("Failed to update pin status. Please try again.");
    }
  }, []);

  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }, []);

  const pinnedComments = comments.filter((comment) => comment.isPinned);
  const regularComments = comments.filter((comment) => !comment.isPinned);

  return (
    <div
      className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div
        className="p-6 border-b border-white/10"
        data-aos="fade-down"
        data-aos-duration="800"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <MessageCircle className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Comments{" "}
            <span className="text-indigo-400">({comments.length})</span>
            {pinnedComments.length > 0 && (
              <span className="text-xs text-indigo-300 ml-2">
                • {pinnedComments.length} pinned
              </span>
            )}
          </h3>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {error && (
          <div
            className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl"
            data-aos="fade-in"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div>
          <CommentForm
            onSubmit={handleCommentSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>

        <div
          className="space-y-4 h-[300px] overflow-y-auto custom-scrollbar"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {comments.length === 0 ? (
            <div className="text-center py-8" data-aos="fade-in">
              <UserCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-50" />
              <p className="text-gray-400">
                No comments yet. Start the conversation!
              </p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <Comment
                key={comment.id}
                comment={comment}
                formatDate={formatDate}
                index={index}
              />
            ))
          )}
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Komentar;
