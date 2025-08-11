import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { logout, checkAuth } from "../store/authSlice";
import Spinner from "@/components/Spinner";
import { clearPosts, fetchPosts } from "../store/postsSlice";
import { clearComments } from "../store/commentsSlice";
import { useNavigate } from "react-router-dom";
// import { fetchComments } from "../store/commentsSlice"; // Uncomment if you have this action

// Extend User type to allow createdAt for display
interface UserWithCreatedAt {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const { posts } = useSelector((state: RootState) => state.posts);
  const { comments: allComments } = useSelector((state: RootState) => state.comments);
  const [editName, setEditName] = useState(user?.username || "");
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!user) dispatch(checkAuth());
    dispatch(fetchPosts({ page: 1, limit: 100 }));
    // dispatch(fetchComments({ userId: user?.id })); // Uncomment if you have this action
  }, [dispatch, user]);

  if (isLoading || !user) return <Spinner />;

  // Calculate karma (sum of votes on posts and comments)
  const karma =
    (posts?.reduce((acc: number, post) => acc + (typeof post.votes === 'number' ? post.votes : 0), 0) || 0) +
    (allComments && typeof allComments === 'object'
      ? Object.values(allComments).reduce((acc: number, commentsArr) =>
          acc + commentsArr.reduce((cAcc: number, c: any) => cAcc + (typeof c.votes === 'number' ? c.votes : 0), 0), 0)
      : 0);

  // Posts and comments count
  const postsCount = posts?.length || 0;
  // Flatten all comments from all posts and filter by current user
  const userComments = allComments && typeof allComments === 'object'
    ? Object.values(allComments)
        .flat()
        .filter((comment: any) => comment.authorId === user.id)
    : [];
  const commentsCount = userComments.length;

  // Change username handler (simulate API call)
  const handleChangeName = () => {
    // TODO: Replace with real API call
    // For now, just update in Redux and re-check auth
    setIsEditing(false);
    dispatch(checkAuth());
  };

  // Delete account handler
  const handleDeleteAccount = () => {
    // TODO: Replace with real API call
    dispatch(logout());
    dispatch(clearPosts());
    dispatch(clearComments());
    navigate("/register");
  };

  const getUserInitials = (username: string) => username.slice(0, 2).toUpperCase();
  const userWithCreatedAt = user as UserWithCreatedAt;

  return (
    <div className="min-h-screen bg-background py-8 px-2 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8">
        {/* User Info & Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="w-16 h-16 bg-reddit-orange rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {getUserInitials(user.username)}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">{user.username}</CardTitle>
              <div className="text-muted-foreground text-sm">{user.email}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Joined: {userWithCreatedAt.createdAt ? format(new Date(userWithCreatedAt.createdAt), "PPP") : "-"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-foreground">{karma}</span>
                <span className="text-xs text-muted-foreground">Karma</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-foreground">{postsCount}</span>
                <span className="text-xs text-muted-foreground">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-foreground">{commentsCount}</span>
                <span className="text-xs text-muted-foreground">Comments</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Username */}
        <Card>
          <CardHeader>
            <CardTitle>Change Username</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-center">
              <Input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                disabled={!isEditing}
                className="max-w-xs"
              />
              {isEditing ? (
                <Button onClick={handleChangeName} size="sm">Save</Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm">Edit</Button>
              )}
              {isEditing && (
                <Button variant="ghost" size="sm" onClick={() => { setEditName(user.username); setIsEditing(false); }}>Cancel</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={() => setDeleteConfirm(true)}>
              Delete Account
            </Button>
            {deleteConfirm && (
              <div className="mt-4 p-4 bg-red-900/30 rounded-lg">
                <div className="mb-2 text-red-400 font-semibold">Are you sure? This action cannot be undone.</div>
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={handleDeleteAccount}>Yes, delete</Button>
                  <Button variant="ghost" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Posts Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {postsCount === 0 ? (
              <div className="text-muted-foreground">You haven't made any posts yet.</div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => {
                  const commentCount = allComments && allComments[post.id] ? allComments[post.id].length : 0;
                  return (
                    <div key={post.id} className="p-4 bg-card border border-reddit-border rounded-lg">
                      <div className="font-semibold text-foreground">{post.title}</div>
                      <div className="text-xs text-muted-foreground mb-1">{post.createdAt ? format(new Date(post.createdAt), "PPP p") : "-"}</div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Karma: {typeof post.votes === 'number' ? post.votes : 0}</span>
                        <span>Comments: {commentCount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {commentsCount === 0 ? (
              <div className="text-muted-foreground">You haven't made any comments yet.</div>
            ) : (
              <div className="space-y-4">
                {userComments.map((comment: any) => (
                  <div key={comment.id} className="p-4 bg-card border border-reddit-border rounded-lg">
                    <div className="text-foreground">{comment.content}</div>
                    <div className="text-xs text-muted-foreground mb-1">{comment.createdAt ? format(new Date(comment.createdAt), "PPP p") : "-"}</div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Karma: {typeof comment.votes === 'number' ? comment.votes : 0}</span>
                    </div>
                    {comment.parent && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Replying to: <span className="italic">{comment.parent.content || "[parent comment/post]"}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 