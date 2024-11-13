import { Helmet } from 'react-helmet-async';

export default function HelmetTitle({post}){
  return(
    <Helmet>
      {post && post.title && <title>{post.title} - PluseUp</title>}
      {post && post.helmetdescription && <meta name="description" content={post.helmetdescription} />}
      {post && post.helmetkeywords && <meta name="keywords" content={post.helmetkeywords} />}
      {post && post.canonicalUrl && <link rel="canonical" href={post.canonicalUrl} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      {post && post.title && <meta property="og:title" content={`${post.title} - PluseUp`} />}
      <meta property="og:type" content="article" />
      {post && post.helmetdescription && <meta property="og:description" content={post.helmetdescription} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  )
}



  