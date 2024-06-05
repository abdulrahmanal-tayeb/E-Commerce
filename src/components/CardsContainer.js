export default function CardsContainer({children}) {
    return (
        <div className="row p-3" style={{display: "flex", justifyContent: "space-around", gap: "3em 1em"}}>
            {children}
        </div>
    )
}