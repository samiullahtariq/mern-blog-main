import { Button } from 'flowbite-react';


export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-slate-500 dark:border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col">
            <h2 className='text-2xl'>
                Want to learn about Role of AI in SEO?
            </h2>
            <p className='text-gray-500 my-2'>
                Checkout this Blog Post
            </p>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
                <a href="https://www.pluseup.com/post/is-ai-the-end-of-seo-how-to-adapt-and-thrive-in-2025" target='_blank' rel='noopener noreferrer'>
                    The Rise of AI and It's Impact on SEO
                </a>
            </Button>
        </div>
        <div className="p-7 flex-1">
        <p className='text-gray-500 my-2 lg:text-xl'>
        Artificial Intelligence (AI) is making waves across various industries, and SEO is no exception. 
        With advancements in AI technology, many professionals wonder if AI will completely overhaul or 
        even replace SEO. In the attached blog, You will get to know how AI is influencing SEO, how to address common concerns,
        and know about actionable strategies for SEO professionals to adapt and thrive in 2025.
            </p>
        </div>
    </div>
  )
}