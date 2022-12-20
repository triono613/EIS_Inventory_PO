
export type MemberStatusPillParams = {
    status: number | null | undefined
}

export const MemberStatusPill = (props: MemberStatusPillParams) => {
    if (props.status == 1) {
        return (
            <span className="badge rounded-pill bg-info ms-5">Trial</span>
        )
    }
    else if (props.status == 2) {
        return (
            <span className="badge rounded-pill bg-success ms-5">Active</span>
        )
    }
    else if (props.status == 3) {
        return (
            <span className="badge rounded-pill bg-danger ms-5">Suspended</span>
        )
    }
    else if (props.status == 4) {
        return (
            <span className="badge rounded-pill bg-warning ms-5">Closed</span>
        )
    }
    else if (props.status == 0) {
        return (
            <span className="badge rounded-pill bg-warning ms-5">Not Active</span>
        )
    }
    else return null;
}