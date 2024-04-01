
import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { useBlogs } from "../hooks"
import { BlogSkeleton } from "../components/Skeleton"


export const Blogs = () => {
    
    const { loading, blogs } = useBlogs();

    if (loading) {
        <Appbar />

        return <div className="flex justify-center">
            <div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            </div>
        </div>
    }
    
    
    return <div>
        <Appbar />
        <div className="flex justify-center">    
            <div className="">
                {blogs.map(blog => <BlogCard
                id={blog.id}
                authorName = {blog.author.name ||  "Hruday Vinayak"}
                title = {blog.title}
                content = {blog.content}
                publishedDate = {"21st August 2024"}
                />)}
            </div>
        </div>
    </div>
}

