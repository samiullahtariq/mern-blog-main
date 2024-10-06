import { Helmet } from 'react-helmet';


export default function HelmetTitle({post}){

return(
<Helmet>
    <title>{post && post.title ? `${post.title} -`: "  "} PluseUp</title>
    <meta name="description" content={post && post.helmetdescription? post.helmetdescription : "This is a bloging Website"} />
    <meta name="keywords" content={post && post.helmetkeywords ? post.helmetkeywords : ""} />
    <link rel="canonical" href={post && post.canonicalUrl ? post.canonicalUrl : ""} />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

</Helmet>
)
}




  