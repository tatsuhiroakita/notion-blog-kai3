import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {
  getAllPosts,
  getAllTags,
  getNumberOfPages,
  getPostsByPage,
  getPostsForTopPage,
} from "../../../lib/notionAPI";
import SinglePost from '../../../components/Post/SinglePost'
import { GetStaticPaths, GetStaticProps } from 'next'
import Pagination from '../../../components/Pagination/Pagination'
import Tag from '../../../components/Tag/Tag';

export const getStaticPaths: GetStaticPaths = async () => {
  const numberOfPage = await getNumberOfPages()
  console.log(numberOfPage)

  let params = [];
  for(let i = 1; i <= numberOfPage; i++) {
    params.push({ params: { page: i.toString() }})
  }

  return {
    paths: params,
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  //const allPosts = await getAllPosts();
  //const fourPosts = await getPostsForTopPage(4);

  const currentPage = context.params?.page;

  const postsByPage = await getPostsByPage(
    parseInt(currentPage.toString(), 10)
  );
  const numberOfPage = await getNumberOfPages()
  //console.log("test",numberOfPage)

  const allTags = await getAllTags();

  return {
    props: {
      postsByPage: postsByPage,
      numberOfPage: numberOfPage,
      allTags: allTags,
    },
    revalidate: 60 * 60 * 6,
  }
}

const BlogPageList = ({ postsByPage, numberOfPage, allTags }) => {
  //console.log(allPosts)
  console.log("asdfadf",numberOfPage)
  return (
    <div className="container h-full w-full mx-auto ">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">Notion Blog🚀</h1>
        <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
          {postsByPage.map((post) => (
            <div key={post.id}>
              <SinglePost 
                title={post.title} 
                description={post.description}
                date={post.date}
                tags={post.tags}
                slug={post.slug}
                isPaginationPage={true}
              />
            </div>
          ))}
        </section>
        <Pagination numberOfPage={numberOfPage} tag={""} />
        <Tag tags={allTags} />
      </main>

    </div>
  )
}


export default BlogPageList;