"use client"

import { SignedIn, useUser,UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import Carousel from './Carousel'
import Header from './Header'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { useRouter } from 'next/navigation';

const RightSidebar = () => {
  const {user}=useUser();
  const topPodcasters=useQuery(api.users.getTopUserByPodcastCount)
  const router = useRouter();

  return (
    <section className='right_sidebar text-white-1'>
      <SignedIn>
        <Link className='flex gap-3 pb-12' href={`/profile/${user?.id}`}>
          <UserButton/>
          <div className='flex w-full items-center justify center'>
            <h1 className='text-16 truncate font-bold text-white-1'>{user?.firstName} {user?.lastName}</h1>
            <Image
              src="/icons/right-arrow.svg"
              alt='arrow'
              width={24}
              height={24}
            />
          </div>
        </Link>
      </SignedIn>

      <section>
        <Header headerTitle='Fans Also like'/>
        <Carousel fansLikeDetail={topPodcasters!}/>
      </section>
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Podcastrs" />
        <div className="flex flex-col gap-6">
          {topPodcasters?.slice(0, 3).map((podcaster) => (
            <div key={podcaster._id} className="flex cursor-pointer justify-between" onClick={() => router.push(`/profile/${podcaster.clerkId}`)}>
              <figure className="flex items-center gap-2">
                <Image
                  src={podcaster.imageUrl}
                  alt={podcaster.name}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 font-semibold text-white-1">{podcaster.name}</h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 font-normal text-white-1">{podcaster.totalPodcasts} podcasts</p>
              </div> 
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default RightSidebar
