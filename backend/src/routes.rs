use warp::Filter;

pub fn routes() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path("health")
        .and(warp::get())
        .map(|| warp::reply::json(&"Server is running"))
}
