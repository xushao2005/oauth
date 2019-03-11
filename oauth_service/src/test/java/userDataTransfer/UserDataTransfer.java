package userDataTransfer;

import base.TestBase;
import com.cmhb.module.auth.domain.User;
import com.cmhb.module.auth.service.UserService;
import org.junit.Test;

import javax.annotation.Resource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

public class UserDataTransfer extends TestBase {
    private static final String MSSQL_DRIVER = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
    private static final String MSSQL_URL = "jdbc:sqlserver://10.8.99.38:21463;databaseName=cmbc";
    private static final String MSSQL_USER = "cmbc";
    private static final String MSSQL_PASSWORD = "cmbc@Cmhb.123";
    private Connection conn = null;

    @Resource
    private UserService userService;

    public UserDataTransfer() throws Exception{
        Class.forName(MSSQL_DRIVER);
    }

    public Connection getConn() throws Exception{
        if (this.conn == null) {
            return DriverManager.getConnection(MSSQL_URL, MSSQL_USER, MSSQL_PASSWORD);
        } else {
            return conn;
        }
    }

    @Test
    public void transfer() {
        String SQL = "SELECT * FROM _temp_user WHERE id > 90291";

        try {
            conn = getConn();
            PreparedStatement ps = conn.prepareStatement(SQL);
            ResultSet rs = ps.executeQuery();

            List<User> list = new ArrayList<>();
            User user;
            while (rs.next()) {
                user = new User();
                user.setId(rs.getLong("id"));
                user.setLoginName(rs.getString("LOGIN_NAME"));
                user.setPassword(rs.getString("PASSWORD"));
                user.setUsername(rs.getString("USERNAME"));
                user.setEmail(rs.getString("EMAIL"));
                user.setPhone(rs.getString("PHONE"));
                user.setMobile(rs.getString("MOBILE"));
                user.setDescription(rs.getString("description"));
                user.setSales(rs.getBoolean("sales"));
                user.setChecking(rs.getBoolean("checking"));
                user.setReceipt(rs.getBoolean("receipt"));
                user.setBranchCompany(rs.getString("branch_company"));
//                user.setDepartment(rs.getString("department"));
                if (rs.getTimestamp("entry_time") != null) {
                    LocalDateTime entryTime = LocalDateTime.ofInstant(
                            Instant.ofEpochMilli(rs.getTimestamp("entry_time").getTime()), ZoneId.systemDefault());
                    user.setEntryTime(entryTime);
                }
                user.setDutyStatus(rs.getBoolean("duty_status"));
                if (rs.getTimestamp("entry_time") != null) {
                    LocalDateTime resignTime = LocalDateTime.ofInstant(
                            Instant.ofEpochMilli(rs.getTimestamp("entry_time").getTime()), ZoneId.systemDefault());
                    user.setResignTime(resignTime);
                }
                user.setStatus(rs.getInt("status"));
                if (rs.getTimestamp("add_time") != null) {
                    LocalDateTime addTime = LocalDateTime.ofInstant(
                            Instant.ofEpochMilli(rs.getTimestamp("add_time").getTime()), ZoneId.systemDefault());
                    user.setAddTime(addTime);
                }
                if (rs.getTimestamp("mod_time") != null) {
                    LocalDateTime modTime = LocalDateTime.ofInstant(
                            Instant.ofEpochMilli(rs.getTimestamp("mod_time").getTime()), ZoneId.systemDefault());
                    user.setModTime(modTime);
                }
                user.setDriver(rs.getBoolean("driver"));
                list.add(user);
            }

            userService.insertBatch(list);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
