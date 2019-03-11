package com.cmhb.common.utils;

import com.cmhb.module.auth.domain.User;

public class PasswordHelper {


    private static String algorithmName = "md5";
    private static int hashIterations = 2;

    public static void setAlgorithmName(String algorithmName) {
        algorithmName = algorithmName;
    }

    public static void setHashIterations(int hashIterations) {
        hashIterations = hashIterations;
    }

    public static void encryptPassword(User user) {
//        String newPassword = new SimpleHash(
//                algorithmName,
//                user.getPassword(),
//                "",
//                hashIterations).toHex();

        String newPassword = MD5Util.md5(user.getPassword());
        user.setPassword(newPassword);
    }

    public static void main(String[] args) {
        User user = new User();
        user.setPassword("1");
        encryptPassword(user);
        System.out.println(user.getPassword());
    }
}
