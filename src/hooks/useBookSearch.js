import { useEffect, useState } from "react";
import axios from "axios";

export default function useBookSearch(query, page) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setBooks([]);
    }, [query])

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;
        axios({
            method: 'GET',
            url: 'https://openlibrary.org/search.json',
            params: { q: query, page: page },
            cancelToken: new axios.CancelToken(c => cancel = c),
        })
            .then(res => {
                console.log(res.data.docs)
                let newBooks = res.data.docs.map(b => { return {key:b.key, title:b.title, authors:b.author_name} });
                setBooks(books => [...new Set([...books, ...newBooks])]);
                setLoading(false);
                setHasMore(res.data.docs.length > 0);
            })
            .catch(e => {
                if (axios.isCancel(e)) { return }
                setError(true)
            })

        return () => cancel()

    }, [query, page])

    return {loading, hasMore, error, books}
}
