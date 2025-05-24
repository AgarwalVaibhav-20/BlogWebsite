import AnimationWrapper from "@/common/page-animation"
import InPageNavigation from "@/components/inpage-navigation.component"

const HomePage = () => {
  return (
    <>
    <AnimationWrapper>
        <section className="h-[100vh] w-full flex justify-center ml-5 ml-5 gap-10">
            {/*new latesg blogs is here  */}
            <div className="w-full pl-5  pr-5">
                <InPageNavigation routes={["Home","Trending" , "Podcasts" , "Games" , " Technology" , "Anime" , "Sports" , "Recipe"]}>

                </InPageNavigation>
            </div>

            {/*Trending blogs*/}
            <div>
            </div>
        </section>
    </AnimationWrapper>
        </>
  )
}

export default HomePage