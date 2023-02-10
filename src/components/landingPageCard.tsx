export default function LandingPageCard({children, tailwindBorderColor}: {children: React.ReactNode, tailwindBorderColor: string}) {
    
    return(
        <div className={`flex-1 flex flex-col justify-center items-center w-full px-4 py-6 lg:px-6 bg-gray-900 rounded-2xl border-2 ${tailwindBorderColor}`}>
            {children}
        </div>
    )
}