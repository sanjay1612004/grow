const BondsCard = () => {
return (

<div className="group relative w-[520px] h-[220px] rounded-[32px] border border-[#E8EBF0] overflow-hidden bg-white cursor-pointer">

{/* Default Image */}
<img
src="https://resources.groww.in/web-assets/story_assets/landing-page/home_page/bonds_base_image.webp"
className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 transition duration-500"
/>

{/* Hover Image */}
<img
src="https://resources.groww.in/web-assets/story_assets/landing-page/home_page/bonds_hover_image.webp"
className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
/>

{/* Content */}
<div className="relative z-10 flex flex-col items-center">

<h2 className="mt-5 text-[24px] font-semibold text-[#44475B]">
Bonds
</h2>

<p className="mt-14 text-[16px] text-[#44475B]">
Earn fixed interest with regular payouts
</p>

</div>

</div>

)

}

export default BondsCard