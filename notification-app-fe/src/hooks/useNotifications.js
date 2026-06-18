import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";

const weights = { Placement: 3, Result: 2, Event: 1 };

class MinHeap {
  constructor() {
    this.data = [];
  }

  size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(item) {
    this.data.push(item);
    this._bubbleUp(this.data.length - 1);
  }

  pop() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  _isLower(a, b) {
    if (a.weight !== b.weight) return a.weight < b.weight;
    return a.time < b.time;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this._isLower(this.data[i], this.data[parent])) {
        [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
        i = parent;
      } else break;
    }
  }

  _sinkDown(i) {
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < this.data.length && this._isLower(this.data[l], this.data[smallest])) smallest = l;
      if (r < this.data.length && this._isLower(this.data[r], this.data[smallest])) smallest = r;
      if (smallest === i) break;
      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }
}

function getTop10(notifications) {
  const heap = new MinHeap();

  for (const n of notifications) {
    const item = {
      ...n,
      weight: weights[n.Type] ?? 0,      // capital Type
      time: new Date(n.Timestamp).getTime(), // capital Timestamp
    };

    if (heap.size() < 10) {
      heap.push(item);
    } else {
      const min = heap.peek();
      const isHigher =
        item.weight > min.weight ||
        (item.weight === min.weight && item.time > min.time);
      if (isHigher) {
        heap.pop();
        heap.push(item);
      }
    }
  }

  const result = [];
  while (heap.size() > 0) result.push(heap.pop());
  return result.reverse();
}

// track viewed notifications in localStorage
function getViewedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem("viewedIds") ?? "[]"));
  } catch {
    return new Set();
  }
}

function markAsViewed(ids) {
  const existing = getViewedIds();
  ids.forEach((id) => existing.add(id));
  localStorage.setItem("viewedIds", JSON.stringify([...existing]));
}

export function useNotifications(filter, page) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchNotifications({ page, type: filter })
      .then((data) => {
        const fetched = data.notifications ?? [];
        const viewedIds = getViewedIds();

        // mark each notification as read or unread
        const withReadStatus = fetched.map((n) => ({
          ...n,
          read: viewedIds.has(n.ID),  // capital ID
        }));

        setNotifications(withReadStatus);
        setLoading(false);

        // mark all current notifications as viewed after 2 seconds
        setTimeout(() => {
          markAsViewed(fetched.map((n) => n.ID));
        }, 2000);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filter, page]);

  const top10 = getTop10(notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalPages = Math.ceil(notifications.length / 10) || 1;

  return { notifications: top10, unreadCount, totalPages, loading, error };
}