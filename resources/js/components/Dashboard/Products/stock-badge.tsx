export default function StockBadge({
    stock,
}) {
    if (stock === 0) {
        return (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                {stock}
            </span>
        );
    }

    if (stock <= 3) {
        return (
            <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                {stock}
            </span>
        );
    }

    if (stock <= 10) {
        return (
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                {stock}
            </span>
        );
    }

    return (
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
            {stock}
        </span>
    );
}