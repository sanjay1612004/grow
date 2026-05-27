const EtfCard = () => {

return (

<div className="h-[220px] rounded-[32px] border border-[#E8EBF0] bg-white flex flex-col items-center">

<h3 className="mt-6 text-[24px] font-semibold text-[#44475B]">
ETFs
</h3>

<p className="mt-2 text-[#7C8595]">
Gold, Silver, International & Index ETFs
</p>

<div className="flex gap-10 mt-8">

<img src="https://resources.groww.in/web-assets/story_assets/landing-page/home_page/gold_funds.svg" className="w-[70px]" />

<img src="https://resources.groww.in/web-assets/story_assets/landing-page/home_page/silver_funds.svg" className="w-[70px]" />

<img src="https://resources.groww.in/web-assets/story_assets/landing-page/home_page/international_funds.svg" className="w-[70px]" />

</div>

</div>

)

}

export default EtfCard