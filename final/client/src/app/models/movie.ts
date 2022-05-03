import {Post} from "./post";

export interface Movie{
    adult: Boolean,
    backdrop_path: string,
    genres: string[],
    id: Number,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: Number,
    poster_path: string,
    release_date: string,
    title: string,
    video: Boolean,
    vote_average: Number,
    vote_count: Number,
    posts: Post[],
    num_posts: Number
};