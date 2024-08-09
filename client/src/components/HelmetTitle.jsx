import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import {useParams } from 'react-router-dom';


export default function HelmetTitle({post}){

return(
<Helmet>
    <title>{post && post.title ? `${post.title} -`: "  "} PluseUp Blogs</title>
    <meta name="description" content={post && post.helmetdescription? post.helmetdescription : "This is a bloging Website"} />
    <meta name="keywords" content={post && post.helmetkeywords ? post.helmetkeywords : ""} />
</Helmet>
)
}




  