const InvestmentCard = ({
    title,
    desc,
    img,
    height
}) => {

    return (

        <div className={`rounded-[32px] border border-[#E8EBF0] bg-white flex flex-col items-center overflow-hidden ${height}`}>

            <h3 className="mt-6 text-[24px] font-semibold text-[#44475B]">
                {title}
            </h3>

            {desc && (
                <p className="mt-3 text-[#7C8595] text-center">
                    {desc}
                </p>
            )}

            <img
                src={img}
                alt={title}
                className="w-[560px] mt-8"
            />

        </div>

    )

}

export default InvestmentCard