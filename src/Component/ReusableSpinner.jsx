import { Spinner } from "reactstrap"

const ReusableSpinner = ({ loading, col }) => {
    return <tr>
        {loading &&
            <td colSpan={col}>
                <div className="d-flex justify-content-center text-warning">
                    <Spinner color="warning">Loading...</Spinner>
                </div>
            </td>}
    </tr>
}
export default ReusableSpinner