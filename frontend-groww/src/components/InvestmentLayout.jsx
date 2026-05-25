import InvestmentCard from "./InvestmentCard"
import EtfCard from "./EtfCard"
import BondsCard from "./BondsCard"

const cards = [
{
title:"Stocks",
img:"https://resources.groww.in/web-assets/story_assets/landing-page/home_page/stocks_placeholder.webp",
height:"h-[460px]"
},
{
title:"Bonds",
desc:"Earn fixed interest with regular payouts",
img:"https://resources.groww.in/web-assets/story_assets/landing-page/home_page/bonds_base_image.webp",
height:"h-[350px]"
},
{
title:"IPOs",
img:"https://resources.groww.in/web-assets/story_assets/landing-page/home_page/ipo_placeholder.webp",
height:"h-[460px]"
},
]

const InvestmentLayout = () => {

return (

<div className="w-[1040px] mx-auto mt-20 grid grid-cols-[1.1fr_1fr] gap-8 my-7">

<div className="flex flex-col gap-8">

<InvestmentCard {...cards[0]} />

<BondsCard/>

</div>

<div className="flex flex-col gap-8">

<EtfCard />

<InvestmentCard {...cards[2]} />

</div>

</div>

)

}

export default InvestmentLayout