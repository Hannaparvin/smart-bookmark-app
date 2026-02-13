"use client"
import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@supabase/supabase-js"

type Bookmark = {
  id: string
  title: string
  url: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch bookmarks from Supabase
  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setBookmarks(data)
  }

  // Handle Authentication and initial fetch
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchBookmarks()
    })
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: { redirectTo: window.location.origin }
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  // Add Bookmark with Optimistic UI update
  const addBookmark = async () => {
    if (!title || !url || !user) return
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`
    
    const tempId = Math.random().toString()
    const newBookmark = { id: tempId, title, url: formattedUrl }
    setBookmarks(prev => [newBookmark, ...prev])
    setTitle("")
    setUrl("")

    const { data, error } = await supabase
      .from("bookmarks")
      .insert([{ title, url: formattedUrl, user_id: user.id }])
      .select()

    if (error) {
      fetchBookmarks() 
      alert("Error adding bookmark")
    } else if (data) {
      setBookmarks(prev => prev.map(b => b.id === tempId ? data[0] : b))
    }
  }

  // Delete Bookmark with instant UI removal
  const deleteBookmark = async (id: string) => {
    const previousBookmarks = [...bookmarks]
    setBookmarks(prev => prev.filter(b => b.id !== id))
    const { error } = await supabase.from("bookmarks").delete().eq("id", id)
    if (error) {
      setBookmarks(previousBookmarks)
      alert("Could not delete")
    }
  }

  // Real-time Search Filter
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(b => 
      b.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [bookmarks, searchQuery])

  // Real-time sync engine for multiple tabs
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`user-bookmarks-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${user.id}` }, () => {
        fetchBookmarks() 
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user])

  // Login Screen UI
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden text-white">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />

        <div className="relative z-10 w-full max-w-md px-6 text-center">
          <div className="bg-[#111111]/70 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.4)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3 tracking-tighter">Smart Bookmark</h1>
            <p className="text-gray-400 mb-10 text-sm font-medium">Your digital collection, elegantly organized.</p>
            <button onClick={signInWithGoogle} className="group w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-bold py-4 px-6 rounded-2xl transition-all shadow-xl">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    )

  // Main Dashboard UI
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
              Collection
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-mono uppercase tracking-widest">
              {bookmarks.length} saved resources
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <input 
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <svg className="absolute left-4 top-2.5 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
            <button onClick={logout} className="px-6 py-2 rounded-full border border-white/10 text-sm font-semibold hover:bg-white hover:text-black transition-all">
              Logout
            </button>
          </div>
        </header>

        {/* Input Form */}
        <div className="relative mb-24 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-[#111111]/80 backdrop-blur-xl p-3 md:p-4 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row gap-3 shadow-2xl">
            <input
              className="bg-white/5 border-none rounded-2xl p-4 flex-1 focus:ring-0 text-white placeholder-gray-600 outline-none text-lg"
              placeholder="Label (e.g. Portfolio)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="hidden md:block w-[1px] h-10 bg-white/5 self-center"></div>
            <input
              className="bg-white/5 border-none rounded-2xl p-4 flex-grow-[2] focus:ring-0 text-white placeholder-gray-600 outline-none text-lg"
              placeholder="Paste link address..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              onClick={addBookmark} 
              className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-12 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Bookmark Grid */}
        {filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-16 gap-x-10">
            {filteredBookmarks.map((b) => {
              let faviconUrl = "";
              try {
                const domain = new URL(b.url).hostname;
                faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
              } catch {
                faviconUrl = "https://www.google.com/s2/favicons?domain=google.com&sz=128";
              }

              return (
                <div key={b.id} className="group flex flex-col items-center gap-5 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="relative">
                    <button 
                      onClick={() => deleteBookmark(b.id)}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-[12px] opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-125 border-2 border-[#050505]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <a 
                      href={b.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-24 h-24 bg-[#121212] rounded-[2.5rem] border border-white/5 flex items-center justify-center group-hover:border-blue-500/40 group-hover:-translate-y-3 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transition-all p-5 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={faviconUrl} 
                        alt={b.title} 
                        className="w-full h-full object-contain filter drop-shadow-xl" 
                      />
                    </a>
                  </div>
                  <span className="text-[14px] font-semibold text-gray-500 group-hover:text-white transition-colors truncate w-full text-center px-2">
                    {b.title}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
             <p className="text-gray-600 font-medium">No bookmarks found.</p>
          </div>
        )}
      </div>
    </div>
  )
}