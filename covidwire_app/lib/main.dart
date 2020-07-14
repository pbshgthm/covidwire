import 'package:flutter/material.dart';
import './webview.dart';
import 'package:flutter/services.dart';

void main() => runApp(MyApp());

const MaterialColor white = const MaterialColor(
  0xFFFFFFFF,
  const <int, Color>{
    50: const Color(0xFFFFFFFF),
    100: const Color(0xFFFFFFFF),
    200: const Color(0xFFFFFFFF),
    300: const Color(0xFFFFFFFF),
    400: const Color(0xFFFFFFFF),
    500: const Color(0xFFFFFFFF),
    600: const Color(0xFFFFFFFF),
    700: const Color(0xFFFFFFFF),
    800: const Color(0xFFFFFFFF),
    900: const Color(0xFFFFFFFF),
  },
);

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
            statusBarColor: white
    ));
    return MaterialApp(
        title: 'Flutter WebView',
        theme: ThemeData(
          primarySwatch: white,
        ),
        home: MyWebView(
          title: "Alligator.io",
          selectedUrl: "https://covidwire.in",
        ));
  }
}
